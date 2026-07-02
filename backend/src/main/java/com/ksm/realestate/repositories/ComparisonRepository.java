package com.ksm.realestate.repositories;

import com.ksm.realestate.models.Comparison;
import com.ksm.realestate.models.User;
import com.ksm.realestate.models.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ComparisonRepository extends JpaRepository<Comparison, Long> {
    List<Comparison> findByUser(User user);

    Optional<Comparison> findByUserAndProperty(User user, Property property);
}
