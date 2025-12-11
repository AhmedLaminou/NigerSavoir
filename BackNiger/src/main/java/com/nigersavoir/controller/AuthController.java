package com.nigersavoir.controller;

import com.nigersavoir.dto.AuthResponse;
import com.nigersavoir.dto.LoginRequest;
import com.nigersavoir.dto.RegisterRequest;
import com.nigersavoir.entity.Network;
import com.nigersavoir.entity.School;
import com.nigersavoir.entity.User;
import com.nigersavoir.repository.NetworkRepository;
import com.nigersavoir.repository.SchoolRepository;
import com.nigersavoir.repository.UserRepository;
import com.nigersavoir.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setCity(request.getCity());
            user.setRegion(request.getRegion());
            user.setRole(User.Role.USER);

            if (request.getSchoolId() != null) {
                School school = schoolRepository.findById(request.getSchoolId()).orElse(null);
                user.setSchool(school);
            }

            user = userRepository.save(user);

            // Auto-join networks
            autoJoinNetworks(user);

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtUtil.generateToken(userDetails);

            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

            return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }
    }

    private void autoJoinNetworks(User user) {
        // Join school network
        if (user.getSchool() != null) {
            Network schoolNetwork = networkRepository
                    .findByTypeAndSchoolId(Network.NetworkType.SCHOOL, user.getSchool().getId())
                    .orElseGet(() -> createSchoolNetwork(user.getSchool()));
            user.getNetworks().add(schoolNetwork);
        }

        // Join city network
        Network cityNetwork = networkRepository
                .findByTypeAndCity(Network.NetworkType.CITY, user.getCity())
                .orElseGet(() -> createCityNetwork(user.getCity(), user.getRegion()));
        user.getNetworks().add(cityNetwork);

        // Join region network
        Network regionNetwork = networkRepository
                .findByTypeAndRegion(Network.NetworkType.REGION, user.getRegion())
                .orElseGet(() -> createRegionNetwork(user.getRegion()));
        user.getNetworks().add(regionNetwork);

        userRepository.save(user);
    }

    private Network createSchoolNetwork(School school) {
        Network network = new Network();
        network.setType(Network.NetworkType.SCHOOL);
        network.setName(school.getName());
        network.setDescription("Network for " + school.getName());
        network.setSchool(school);
        network.setCity(school.getCity());
        network.setRegion(school.getRegion());
        return networkRepository.save(network);
    }

    private Network createCityNetwork(String city, String region) {
        Network network = new Network();
        network.setType(Network.NetworkType.CITY);
        network.setName(city);
        network.setDescription("Network for students in " + city);
        network.setCity(city);
        network.setRegion(region);
        return networkRepository.save(network);
    }

    private Network createRegionNetwork(String region) {
        Network network = new Network();
        network.setType(Network.NetworkType.REGION);
        network.setName(region);
        network.setDescription("Network for students in " + region);
        network.setRegion(region);
        return networkRepository.save(network);
    }
}
