package com.nigersavoir.repository;

import com.nigersavoir.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT b FROM Book b LEFT JOIN b.school s WHERE " +
            "(:q IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :q, '%'))) AND " +
            "(:subject IS NULL OR b.subject = :subject) AND " +
            "(:level IS NULL OR b.level = :level) AND " +
            "(:schoolId IS NULL OR s.id = :schoolId)")
    List<Book> search(
            @Param("q") String q,
            @Param("subject") String subject,
            @Param("level") String level,
            @Param("schoolId") Long schoolId
    );
}
