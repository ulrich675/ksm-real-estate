package com.ksm.realestate.repositories;

import com.ksm.realestate.models.VirtualTourPayment;
import com.ksm.realestate.models.User;
import com.ksm.realestate.models.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VirtualTourPaymentRepository extends JpaRepository<VirtualTourPayment, Long> {
    Optional<VirtualTourPayment> findByUserAndProperty(User user, Property property);
}
