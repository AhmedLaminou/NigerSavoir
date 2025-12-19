package com.nigersavoir.controller;

import com.nigersavoir.entity.Document;
import com.nigersavoir.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("subject") String subject,
            @RequestParam("level") String level,
            @RequestParam("type") Document.DocumentType type,
            @RequestParam("year") String year,
            @RequestParam(value = "schoolId", required = false) Long schoolId,
            Authentication authentication) {
        try {
            Document doc = documentService.uploadDocument(
                    file, title, description, subject, level, type, year, schoolId, authentication.getName());
            return ResponseEntity.ok(doc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not upload the file: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Document>> searchDocuments(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Document.DocumentType type,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) Long schoolId,
            @RequestParam(required = false) String region) {
        return ResponseEntity.ok(documentService.searchDocuments(subject, level, type, year, schoolId, region));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        documentService.incrementViewCount(id);
        return ResponseEntity.ok(documentService.getDocument(id));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Document doc = documentService.getDocument(id);
        documentService.incrementDownloadCount(id);

        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(doc.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("application/octet-stream"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFilePath() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
