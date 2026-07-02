package com.ksm.realestate.repositories;

import com.ksm.realestate.models.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByProprietorId(Long proprietorId);

    List<Property> findByCategory(String category);

    List<Property> findByStatus(String status);
}
