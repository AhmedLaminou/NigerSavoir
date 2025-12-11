package com.nigersavoir.repository;

import com.nigersavoir.entity.UserBehavior;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBehaviorRepository extends JpaRepository<UserBehavior, Long> {
    List<UserBehavior> findByUserId(Long userId);

    @Query("SELECT ub.document.id, COUNT(ub) as count FROM UserBehavior ub " +
            "WHERE ub.user.id = :userId GROUP BY ub.document.id ORDER BY count DESC")
    List<Object[]> findMostInteractedDocumentsByUser(@Param("userId") Long userId);

    @Query("SELECT ub.document.id FROM UserBehavior ub " +
            "WHERE ub.user.id IN :userIds AND ub.document.id NOT IN " +
            "(SELECT ub2.document.id FROM UserBehavior ub2 WHERE ub2.user.id = :currentUserId) " +
            "GROUP BY ub.document.id ORDER BY COUNT(ub) DESC")
    List<Long> findRecommendedDocumentsFromSimilarUsers(
            @Param("currentUserId") Long currentUserId,
            @Param("userIds") List<Long> userIds);
}
