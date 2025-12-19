package com.nigersavoir.controller;

import com.nigersavoir.entity.Book;
import com.nigersavoir.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/books")
@CrossOrigin(origins = "*")
public class AdminBookController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public ResponseEntity<List<Book>> list() {
        return ResponseEntity.ok(bookRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Book> create(@RequestBody Book book) {
        return ResponseEntity.ok(bookRepository.save(book));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id, @RequestBody Book payload) {
        Book existing = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        existing.setTitle(payload.getTitle());
        existing.setAuthor(payload.getAuthor());
        existing.setDescription(payload.getDescription());
        existing.setPrice(payload.getPrice());
        existing.setCoverImageUrl(payload.getCoverImageUrl());
        existing.setStock(payload.getStock());
        existing.setSubject(payload.getSubject());
        existing.setLevel(payload.getLevel());
        existing.setSchool(payload.getSchool());
        return ResponseEntity.ok(bookRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
