package com.nigersavoir.repository;

import com.nigersavoir.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findBySubject(String subject);

    List<Document> findByLevel(String level);

    List<Document> findBySchoolId(Long schoolId);

    @Query("SELECT d FROM Document d WHERE " +
            "(:subject IS NULL OR d.subject = :subject) AND " +
            "(:level IS NULL OR d.level LIKE %:level%) AND " +
            "(:type IS NULL OR d.type = :type) AND " +
            "(:year IS NULL OR d.year = :year) AND " +
            "(:schoolId IS NULL OR d.school.id = :schoolId)")
    List<Document> searchDocuments(
            @Param("subject") String subject,
            @Param("level") String level,
            @Param("type") Document.DocumentType type,
            @Param("year") String year,
            @Param("schoolId") Long schoolId);

    @Query("SELECT d FROM Document d ORDER BY d.downloadCount DESC")
    List<Document> findMostDownloaded();

    @Query("SELECT d FROM Document d WHERE d.school.id = :schoolId ORDER BY d.downloadCount DESC")
    List<Document> findPopularInSchool(@Param("schoolId") Long schoolId);
}
