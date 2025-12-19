package com.nigersavoir.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDocumentRow {
    private Long id;
    private String title;
    private String subject;
    private String level;
    private String type;
    private String year;
    private String school;
    private String uploader;
    private Integer downloads;
    private Integer views;
    private String uploadDate;
}
