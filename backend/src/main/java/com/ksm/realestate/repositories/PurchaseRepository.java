package com.ksm.realestate.repositories;

import com.ksm.realestate.models.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUserId(Long userId);

    List<Purchase> findByPropertyProprietorId(Long proprietorId);

    boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);

    java.util.Optional<Purchase> findByUserIdAndPropertyId(Long userId, Long propertyId);
}
