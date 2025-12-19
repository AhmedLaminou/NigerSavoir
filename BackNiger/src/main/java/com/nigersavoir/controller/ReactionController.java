package com.nigersavoir.controller;

import com.nigersavoir.dto.BookReactionRequest;
import com.nigersavoir.dto.BookReactionSummary;
import com.nigersavoir.dto.DocumentReactionRequest;
import com.nigersavoir.dto.DocumentReactionSummary;
import com.nigersavoir.service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reactions")
@CrossOrigin(origins = "*")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    @GetMapping("/documents/summary")
    public ResponseEntity<List<DocumentReactionSummary>> getDocumentReactionSummary(
            @RequestParam(name = "ids") List<Long> documentIds,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(reactionService.getDocumentSummaries(documentIds, email));
    }

    @PostMapping("/documents/{documentId}")
    public ResponseEntity<DocumentReactionSummary> setDocumentReaction(
            @PathVariable Long documentId,
            @RequestBody DocumentReactionRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(reactionService.setDocumentReaction(
                documentId,
                authentication.getName(),
                request != null ? request.getReactionType() : null
        ));
    }

    @GetMapping("/books/summary")
    public ResponseEntity<List<BookReactionSummary>> getBookReactionSummary(
            @RequestParam(name = "ids") List<Long> bookIds,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(reactionService.getBookSummaries(bookIds, email));
    }

    @PostMapping("/books/{bookId}")
    public ResponseEntity<BookReactionSummary> setBookReaction(
            @PathVariable Long bookId,
            @RequestBody BookReactionRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(reactionService.setBookReaction(
                bookId,
                authentication.getName(),
                request != null ? request.getReactionType() : null
        ));
    }
}
