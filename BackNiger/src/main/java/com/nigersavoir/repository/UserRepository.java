package com.nigersavoir.repository;

import com.nigersavoir.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findTop10ByOrderByCreatedAtDesc();

    List<User> findTop100ByOrderByCreatedAtDesc();

    @Query("SELECT u FROM User u LEFT JOIN u.school s WHERE u.id <> :excludeUserId AND " +
            "(:schoolId IS NULL OR s.id = :schoolId) AND " +
            "(:grade IS NULL OR u.grade = :grade) AND " +
            "(:region IS NULL OR u.region = :region) " +
            "ORDER BY u.createdAt DESC")
    List<User> discoverUsers(
            @Param("excludeUserId") Long excludeUserId,
            @Param("schoolId") Long schoolId,
            @Param("grade") String grade,
            @Param("region") String region
    );
}
