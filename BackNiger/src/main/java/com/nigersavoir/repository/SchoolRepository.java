package com.nigersavoir.repository;

import com.nigersavoir.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {
    List<School> findByCity(String city);

    List<School> findByRegion(String region);
}
