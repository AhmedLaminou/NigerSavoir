package com.nigersavoir.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserRow {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String school;
    private String city;
    private String region;
    private String joinDate;
    private Integer uploads;
}
