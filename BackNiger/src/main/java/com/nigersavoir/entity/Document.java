package com.nigersavoir.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String level;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;

    @Column(nullable = false)
    private String year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User uploadedBy;

    @Column(nullable = false)
    private String format; // PDF, IMAGE

    @Column(nullable = false)
    private Integer downloadCount = 0;

    @Column(nullable = false)
    private Integer viewCount = 0;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadDate;

    public enum DocumentType {
        COURS, DEVOIR, EXAMEN, BACCALAUREAT, CONCOURS
    }
}
