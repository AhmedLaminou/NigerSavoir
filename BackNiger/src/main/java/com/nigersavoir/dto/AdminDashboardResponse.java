package com.nigersavoir.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private Stats stats;
    private List<RecentDocument> recentDocuments = new ArrayList<>();
    private List<RecentUser> recentUsers = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Stats {
        private long totalUsers;
        private long totalDocuments;
        private long totalBooks;
        private long totalOrders;
        private long recentUploads;
        private long flaggedContent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentDocument {
        private Long id;
        private String title;
        private String uploader;
        private String school;
        private String subject;
        private String level;
        private String uploadDate;
        private Integer downloads;
        private String status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentUser {
        private Long id;
        private String name;
        private String email;
        private String school;
        private String region;
        private String joinDate;
        private Integer uploads;
        private String status;
    }
}
