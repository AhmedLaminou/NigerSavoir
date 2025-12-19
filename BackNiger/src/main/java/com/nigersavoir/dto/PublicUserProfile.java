package com.nigersavoir.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicUserProfile {
    private Long id;
    private String name;
    private String city;
    private String region;
    private String grade;
    private Long schoolId;
    private String schoolName;
}
