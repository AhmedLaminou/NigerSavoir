package com.nigersavoir.repository;

import com.nigersavoir.entity.BookReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookReactionRepository extends JpaRepository<BookReaction, Long> {
    Optional<BookReaction> findByUserIdAndBookId(Long userId, Long bookId);

    long countByBookIdAndReactionType(Long bookId, BookReaction.ReactionType reactionType);

    @Query("SELECT br.book.id, br.reactionType, COUNT(br) FROM BookReaction br " +
            "WHERE br.book.id IN :bookIds GROUP BY br.book.id, br.reactionType")
    List<Object[]> countReactionsByBookIds(@Param("bookIds") List<Long> bookIds);

    @Query("SELECT br.book.id, br.reactionType FROM BookReaction br " +
            "WHERE br.user.id = :userId AND br.book.id IN :bookIds")
    List<Object[]> findUserReactionsForBooks(
            @Param("userId") Long userId,
            @Param("bookIds") List<Long> bookIds);
}
