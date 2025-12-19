package com.nigersavoir.repository;

import com.nigersavoir.entity.DocumentReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentReactionRepository extends JpaRepository<DocumentReaction, Long> {
    Optional<DocumentReaction> findByUserIdAndDocumentId(Long userId, Long documentId);

    long countByDocumentIdAndReactionType(Long documentId, DocumentReaction.ReactionType reactionType);

    @Query("SELECT dr.document.id, dr.reactionType, COUNT(dr) FROM DocumentReaction dr " +
            "WHERE dr.document.id IN :documentIds GROUP BY dr.document.id, dr.reactionType")
    List<Object[]> countReactionsByDocumentIds(@Param("documentIds") List<Long> documentIds);

    @Query("SELECT dr.document.id, dr.reactionType FROM DocumentReaction dr " +
            "WHERE dr.user.id = :userId AND dr.document.id IN :documentIds")
    List<Object[]> findUserReactionsForDocuments(
            @Param("userId") Long userId,
            @Param("documentIds") List<Long> documentIds);
}
