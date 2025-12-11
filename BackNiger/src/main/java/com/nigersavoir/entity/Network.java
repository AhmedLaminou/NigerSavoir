package com.nigersavoir.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "networks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Network {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NetworkType type;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    private String city;

    private String region;

    @ManyToMany(mappedBy = "networks")
    private Set<User> members = new HashSet<>();

    public enum NetworkType {
        SCHOOL, CITY, REGION
    }
}
