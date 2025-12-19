package com.nigersavoir.repository;

import com.nigersavoir.entity.Network;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NetworkRepository extends JpaRepository<Network, Long> {
    List<Network> findByType(Network.NetworkType type);

    Optional<Network> findByTypeAndSchoolId(Network.NetworkType type, Long schoolId);

    Optional<Network> findByTypeAndSchoolIdAndGrade(Network.NetworkType type, Long schoolId, String grade);

    Optional<Network> findByTypeAndCity(Network.NetworkType type, String city);

    Optional<Network> findByTypeAndRegion(Network.NetworkType type, String region);
}
