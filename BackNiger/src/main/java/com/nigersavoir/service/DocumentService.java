package com.nigersavoir.service;

import com.nigersavoir.entity.Document;
import com.nigersavoir.entity.School;
import com.nigersavoir.entity.User;
import com.nigersavoir.repository.DocumentRepository;
import com.nigersavoir.repository.SchoolRepository;
import com.nigersavoir.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Document uploadDocument(MultipartFile file, String title, String description,
            String subject, String level, Document.DocumentType type,
            String year, Long schoolId, String userEmail) throws IOException {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        try {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        } catch (Exception e) {
            fileExtension = "";
        }

        String fileName = UUID.randomUUID().toString() + fileExtension;

        // Copy file to the target location (Replacing existing file with the same name)
        Path targetLocation = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileName);
        Files.createDirectories(targetLocation.getParent());
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        Document document = new Document();
        document.setTitle(title);
        document.setDescription(description);
        document.setFilePath(fileName);
        document.setSubject(subject);
        document.setLevel(level);
        document.setType(type);
        document.setYear(year);
        document.setUploadedBy(user);
        document.setUploadDate(LocalDateTime.now());
        document.setFormat(fileExtension.replace(".", "").toUpperCase());

        if (schoolId != null) {
            School school = schoolRepository.findById(schoolId).orElse(null);
            document.setSchool(school);
        } else {
            document.setSchool(user.getSchool());
        }

        return documentRepository.save(document);
    }

    public List<Document> searchDocuments(String subject, String level, Document.DocumentType type, String year,
            Long schoolId, String region) {
        return documentRepository.searchDocuments(subject, level, type, year, schoolId, region);
    }

    public Document getDocument(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public void incrementDownloadCount(Long id) {
        Document doc = getDocument(id);
        doc.setDownloadCount(doc.getDownloadCount() + 1);
        documentRepository.save(doc);
    }

    public void incrementViewCount(Long id) {
        Document doc = getDocument(id);
        doc.setViewCount(doc.getViewCount() + 1);
        documentRepository.save(doc);
    }
}
