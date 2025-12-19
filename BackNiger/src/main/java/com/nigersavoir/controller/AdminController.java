package com.nigersavoir.controller;

import com.nigersavoir.dto.AdminDashboardResponse;
import com.nigersavoir.dto.AdminDocumentRow;
import com.nigersavoir.dto.AdminOrderRow;
import com.nigersavoir.dto.AdminUserRow;
import com.nigersavoir.entity.Document;
import com.nigersavoir.entity.School;
import com.nigersavoir.entity.Order;
import com.nigersavoir.entity.User;
import com.nigersavoir.repository.BookRepository;
import com.nigersavoir.repository.DocumentRepository;
import com.nigersavoir.repository.OrderRepository;
import com.nigersavoir.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderRepository orderRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        long totalUsers = userRepository.count();
        long totalDocuments = documentRepository.count();
        long totalBooks = bookRepository.count();
        long totalOrders = orderRepository.count();

        LocalDateTime since = LocalDateTime.now().minusDays(7);
        long recentUploads = documentRepository.countByUploadDateAfter(since);

        long flaggedContent = 0;

        AdminDashboardResponse.Stats stats = new AdminDashboardResponse.Stats(
                totalUsers,
                totalDocuments,
                totalBooks,
                totalOrders,
                recentUploads,
                flaggedContent
        );

        List<Document> docs = documentRepository.findTop10ByOrderByUploadDateDesc();
        List<User> users = userRepository.findTop10ByOrderByCreatedAtDesc();

        Map<Long, Integer> uploadsByUserId = new HashMap<>();
        List<Long> userIds = users.stream().map(User::getId).toList();
        if (!userIds.isEmpty()) {
            for (Object[] row : documentRepository.countUploadsByUserIds(userIds)) {
                Long userId = (Long) row[0];
                Long cnt = (Long) row[1];
                uploadsByUserId.put(userId, cnt.intValue());
            }
        }

        List<AdminDashboardResponse.RecentDocument> recentDocuments = new ArrayList<>();
        for (Document d : docs) {
            School school = d.getSchool();
            String schoolName = school != null ? school.getName() : "—";
            String uploader = d.getUploadedBy() != null ? d.getUploadedBy().getName() : "—";
            String date = d.getUploadDate() != null ? d.getUploadDate().toLocalDate().format(DATE_FMT) : "";

            recentDocuments.add(new AdminDashboardResponse.RecentDocument(
                    d.getId(),
                    d.getTitle(),
                    uploader,
                    schoolName,
                    d.getSubject(),
                    d.getLevel(),
                    date,
                    d.getDownloadCount(),
                    "approved"
            ));
        }

        List<AdminDashboardResponse.RecentUser> recentUsers = new ArrayList<>();
        for (User u : users) {
            School school = u.getSchool();
            String schoolName = school != null ? school.getName() : "—";
            String date = u.getCreatedAt() != null ? u.getCreatedAt().toLocalDate().format(DATE_FMT) : "";
            recentUsers.add(new AdminDashboardResponse.RecentUser(
                    u.getId(),
                    u.getName(),
                    u.getEmail(),
                    schoolName,
                    u.getRegion(),
                    date,
                    uploadsByUserId.getOrDefault(u.getId(), 0),
                    "active"
            ));
        }

        return ResponseEntity.ok(new AdminDashboardResponse(stats, recentDocuments, recentUsers));
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserRow>> users() {
        List<User> users = userRepository.findTop100ByOrderByCreatedAtDesc();

        Map<Long, Integer> uploadsByUserId = new HashMap<>();
        List<Long> userIds = users.stream().map(User::getId).toList();
        if (!userIds.isEmpty()) {
            for (Object[] row : documentRepository.countUploadsByUserIds(userIds)) {
                Long userId = (Long) row[0];
                Long cnt = (Long) row[1];
                uploadsByUserId.put(userId, cnt.intValue());
            }
        }

        List<AdminUserRow> out = new ArrayList<>();
        for (User u : users) {
            School school = u.getSchool();
            String schoolName = school != null ? school.getName() : "—";
            String joinDate = u.getCreatedAt() != null ? u.getCreatedAt().toLocalDate().format(DATE_FMT) : "";
            out.add(new AdminUserRow(
                    u.getId(),
                    u.getName(),
                    u.getEmail(),
                    u.getRole() != null ? u.getRole().name() : "USER",
                    schoolName,
                    u.getCity(),
                    u.getRegion(),
                    joinDate,
                    uploadsByUserId.getOrDefault(u.getId(), 0)
            ));
        }
        return ResponseEntity.ok(out);
    }

    @GetMapping("/documents")
    public ResponseEntity<List<AdminDocumentRow>> documents() {
        List<Document> docs = documentRepository.findTop100ByOrderByUploadDateDesc();
        List<AdminDocumentRow> out = new ArrayList<>();
        for (Document d : docs) {
            School school = d.getSchool();
            String schoolName = school != null ? school.getName() : "—";
            String uploader = d.getUploadedBy() != null ? d.getUploadedBy().getName() : "—";
            String date = d.getUploadDate() != null ? d.getUploadDate().toLocalDate().format(DATE_FMT) : "";
            out.add(new AdminDocumentRow(
                    d.getId(),
                    d.getTitle(),
                    d.getSubject(),
                    d.getLevel(),
                    d.getType() != null ? d.getType().name() : "",
                    d.getYear(),
                    schoolName,
                    uploader,
                    d.getDownloadCount(),
                    d.getViewCount(),
                    date
            ));
        }
        return ResponseEntity.ok(out);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderRow>> orders() {
        List<Order> orders = orderRepository.findTop100ByOrderByCreatedAtDesc();
        List<AdminOrderRow> out = new ArrayList<>();
        for (Order o : orders) {
            String date = o.getCreatedAt() != null ? o.getCreatedAt().toLocalDate().format(DATE_FMT) : "";
            String email = o.getUser() != null ? o.getUser().getEmail() : "—";
            int itemCount = o.getItems() != null ? o.getItems().size() : 0;
            out.add(new AdminOrderRow(
                    o.getId(),
                    o.getStatus() != null ? o.getStatus().name() : "",
                    o.getTotalAmount(),
                    date,
                    email,
                    itemCount
            ));
        }
        return ResponseEntity.ok(out);
    }
}
