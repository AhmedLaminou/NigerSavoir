package com.nigersavoir.controller;

import com.nigersavoir.dto.PublicUserProfile;
import com.nigersavoir.entity.School;
import com.nigersavoir.entity.User;
import com.nigersavoir.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> me(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/discover")
    public ResponseEntity<List<PublicUserProfile>> discover(
            @RequestParam(required = false) Long schoolId,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String region,
            Authentication authentication
    ) {
        User me = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long mySchoolId = me.getSchool() != null ? me.getSchool().getId() : null;
        String myGrade = me.getGrade();
        String myRegion = me.getRegion();

        Long effectiveSchoolId = mySchoolId != null ? mySchoolId : schoolId;
        String effectiveGrade = (myGrade != null && !myGrade.isBlank()) ? myGrade : grade;

        String effectiveRegion = myRegion;
        if (region != null && myRegion != null && region.equalsIgnoreCase(myRegion)) {
            effectiveRegion = myRegion;
        }

        if (mySchoolId != null && schoolId != null && !schoolId.equals(mySchoolId)) {
            effectiveSchoolId = mySchoolId;
        }
        if (myGrade != null && grade != null && !grade.equalsIgnoreCase(myGrade)) {
            effectiveGrade = myGrade;
        }

        List<User> candidates = userRepository.discoverUsers(me.getId(), effectiveSchoolId, effectiveGrade, effectiveRegion);

        List<PublicUserProfile> out = new ArrayList<>();
        for (User u : candidates) {
            School s = u.getSchool();
            out.add(new PublicUserProfile(
                    u.getId(),
                    u.getName(),
                    u.getCity(),
                    u.getRegion(),
                    u.getGrade(),
                    s != null ? s.getId() : null,
                    s != null ? s.getName() : null
            ));
        }

        return ResponseEntity.ok(out);
    }
}
