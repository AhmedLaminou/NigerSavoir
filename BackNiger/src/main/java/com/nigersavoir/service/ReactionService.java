package com.nigersavoir.service;

import com.nigersavoir.dto.BookReactionSummary;
import com.nigersavoir.dto.DocumentReactionSummary;
import com.nigersavoir.entity.Book;
import com.nigersavoir.entity.BookReaction;
import com.nigersavoir.entity.DocumentReaction;
import com.nigersavoir.entity.User;
import com.nigersavoir.repository.BookReactionRepository;
import com.nigersavoir.repository.BookRepository;
import com.nigersavoir.repository.DocumentReactionRepository;
import com.nigersavoir.repository.DocumentRepository;
import com.nigersavoir.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReactionService {

    @Autowired
    private DocumentReactionRepository documentReactionRepository;

    @Autowired
    private BookReactionRepository bookReactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private BookRepository bookRepository;

    public List<DocumentReactionSummary> getDocumentSummaries(List<Long> documentIds, String userEmailOrNull) {
        if (documentIds == null || documentIds.isEmpty()) {
            return List.of();
        }

        Map<Long, Long> likeCounts = new HashMap<>();
        Map<Long, Long> dislikeCounts = new HashMap<>();

        for (Object[] row : documentReactionRepository.countReactionsByDocumentIds(documentIds)) {
            Long documentId = (Long) row[0];
            DocumentReaction.ReactionType reactionType = (DocumentReaction.ReactionType) row[1];
            Long count = (Long) row[2];

            if (reactionType == DocumentReaction.ReactionType.LIKE) {
                likeCounts.put(documentId, count);
            } else if (reactionType == DocumentReaction.ReactionType.DISLIKE) {
                dislikeCounts.put(documentId, count);
            }
        }

        Map<Long, DocumentReaction.ReactionType> myReactions = new HashMap<>();
        if (userEmailOrNull != null && !userEmailOrNull.isBlank()) {
            User user = userRepository.findByEmail(userEmailOrNull).orElse(null);
            if (user != null) {
                for (Object[] row : documentReactionRepository.findUserReactionsForDocuments(user.getId(), documentIds)) {
                    Long documentId = (Long) row[0];
                    DocumentReaction.ReactionType reactionType = (DocumentReaction.ReactionType) row[1];
                    myReactions.put(documentId, reactionType);
                }
            }
        }

        List<DocumentReactionSummary> out = new ArrayList<>(documentIds.size());
        for (Long documentId : documentIds) {
            out.add(new DocumentReactionSummary(
                    documentId,
                    likeCounts.getOrDefault(documentId, 0L),
                    dislikeCounts.getOrDefault(documentId, 0L),
                    myReactions.get(documentId)
            ));
        }
        return out;
    }

    public DocumentReactionSummary setDocumentReaction(Long documentId, String userEmail, DocumentReaction.ReactionType reactionTypeOrNull) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.nigersavoir.entity.Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        Optional<DocumentReaction> existingOpt = documentReactionRepository.findByUserIdAndDocumentId(user.getId(), documentId);

        if (reactionTypeOrNull == null) {
            existingOpt.ifPresent(documentReactionRepository::delete);
        } else if (existingOpt.isPresent()) {
            DocumentReaction existing = existingOpt.get();
            if (existing.getReactionType() == reactionTypeOrNull) {
                documentReactionRepository.delete(existing);
            } else {
                existing.setReactionType(reactionTypeOrNull);
                documentReactionRepository.save(existing);
            }
        } else {
            DocumentReaction dr = new DocumentReaction();
            dr.setUser(user);
            dr.setDocument(document);
            dr.setReactionType(reactionTypeOrNull);
            documentReactionRepository.save(dr);
        }

        long likeCount = documentReactionRepository.countByDocumentIdAndReactionType(documentId, DocumentReaction.ReactionType.LIKE);
        long dislikeCount = documentReactionRepository.countByDocumentIdAndReactionType(documentId, DocumentReaction.ReactionType.DISLIKE);

        DocumentReaction.ReactionType myReaction = documentReactionRepository.findByUserIdAndDocumentId(user.getId(), documentId)
                .map(DocumentReaction::getReactionType)
                .orElse(null);

        return new DocumentReactionSummary(documentId, likeCount, dislikeCount, myReaction);
    }

    public List<BookReactionSummary> getBookSummaries(List<Long> bookIds, String userEmailOrNull) {
        if (bookIds == null || bookIds.isEmpty()) {
            return List.of();
        }

        Map<Long, Long> likeCounts = new HashMap<>();
        Map<Long, Long> dislikeCounts = new HashMap<>();

        for (Object[] row : bookReactionRepository.countReactionsByBookIds(bookIds)) {
            Long bookId = (Long) row[0];
            BookReaction.ReactionType reactionType = (BookReaction.ReactionType) row[1];
            Long count = (Long) row[2];

            if (reactionType == BookReaction.ReactionType.LIKE) {
                likeCounts.put(bookId, count);
            } else if (reactionType == BookReaction.ReactionType.DISLIKE) {
                dislikeCounts.put(bookId, count);
            }
        }

        Map<Long, BookReaction.ReactionType> myReactions = new HashMap<>();
        if (userEmailOrNull != null && !userEmailOrNull.isBlank()) {
            User user = userRepository.findByEmail(userEmailOrNull).orElse(null);
            if (user != null) {
                for (Object[] row : bookReactionRepository.findUserReactionsForBooks(user.getId(), bookIds)) {
                    Long bookId = (Long) row[0];
                    BookReaction.ReactionType reactionType = (BookReaction.ReactionType) row[1];
                    myReactions.put(bookId, reactionType);
                }
            }
        }

        List<BookReactionSummary> out = new ArrayList<>(bookIds.size());
        for (Long bookId : bookIds) {
            out.add(new BookReactionSummary(
                    bookId,
                    likeCounts.getOrDefault(bookId, 0L),
                    dislikeCounts.getOrDefault(bookId, 0L),
                    myReactions.get(bookId)
            ));
        }
        return out;
    }

    public BookReactionSummary setBookReaction(Long bookId, String userEmail, BookReaction.ReactionType reactionTypeOrNull) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Optional<BookReaction> existingOpt = bookReactionRepository.findByUserIdAndBookId(user.getId(), bookId);

        if (reactionTypeOrNull == null) {
            existingOpt.ifPresent(bookReactionRepository::delete);
        } else if (existingOpt.isPresent()) {
            BookReaction existing = existingOpt.get();
            if (existing.getReactionType() == reactionTypeOrNull) {
                bookReactionRepository.delete(existing);
            } else {
                existing.setReactionType(reactionTypeOrNull);
                bookReactionRepository.save(existing);
            }
        } else {
            BookReaction br = new BookReaction();
            br.setUser(user);
            br.setBook(book);
            br.setReactionType(reactionTypeOrNull);
            bookReactionRepository.save(br);
        }

        long likeCount = bookReactionRepository.countByBookIdAndReactionType(bookId, BookReaction.ReactionType.LIKE);
        long dislikeCount = bookReactionRepository.countByBookIdAndReactionType(bookId, BookReaction.ReactionType.DISLIKE);

        BookReaction.ReactionType myReaction = bookReactionRepository.findByUserIdAndBookId(user.getId(), bookId)
                .map(BookReaction::getReactionType)
                .orElse(null);

        return new BookReactionSummary(bookId, likeCount, dislikeCount, myReaction);
    }
}
