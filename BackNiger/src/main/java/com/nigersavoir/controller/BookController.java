package com.nigersavoir.controller;

import com.nigersavoir.entity.Book;
import com.nigersavoir.service.MarketplaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private MarketplaceService marketplaceService;

    @GetMapping
    public ResponseEntity<List<Book>> listBooks(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Long schoolId,
            @RequestParam(required = false) List<Long> ids
    ) {
        if (ids != null && !ids.isEmpty()) {
            return ResponseEntity.ok(marketplaceService.getBooksByIds(ids));
        }
        return ResponseEntity.ok(marketplaceService.searchBooks(q, subject, level, schoolId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        return ResponseEntity.ok(marketplaceService.getBook(id));
    }
}
