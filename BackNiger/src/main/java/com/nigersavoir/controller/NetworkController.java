package com.nigersavoir.controller;

import com.nigersavoir.entity.Network;
import com.nigersavoir.repository.NetworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/networks")
@CrossOrigin(origins = "*")
public class NetworkController {

    @Autowired
    private NetworkRepository networkRepository;

    @GetMapping
    public ResponseEntity<List<Network>> getAllNetworks() {
        return ResponseEntity.ok(networkRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Network> getNetwork(@PathVariable Long id) {
        return networkRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Network>> getNetworksByType(@PathVariable Network.NetworkType type) {
        return ResponseEntity.ok(networkRepository.findByType(type));
    }
}
