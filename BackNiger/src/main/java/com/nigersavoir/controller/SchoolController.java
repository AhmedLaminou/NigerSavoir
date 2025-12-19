package com.nigersavoir.controller;

import com.nigersavoir.entity.School;
import com.nigersavoir.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schools")
@CrossOrigin(origins = "*")
public class SchoolController {

    @Autowired
    private SchoolRepository schoolRepository;

    @GetMapping
    public ResponseEntity<List<School>> listSchools(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String city
    ) {
        if (region != null && !region.isBlank()) {
            return ResponseEntity.ok(schoolRepository.findByRegion(region));
        }
        if (city != null && !city.isBlank()) {
            return ResponseEntity.ok(schoolRepository.findByCity(city));
        }
        return ResponseEntity.ok(schoolRepository.findAll());
    }
}
