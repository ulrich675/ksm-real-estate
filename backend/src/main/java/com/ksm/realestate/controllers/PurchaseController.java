package com.ksm.realestate.controllers;

import com.ksm.realestate.models.Purchase;
import com.ksm.realestate.models.Property;
import com.ksm.realestate.repositories.PurchaseRepository;
import com.ksm.realestate.repositories.PropertyRepository;
import com.ksm.realestate.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*")
public class PurchaseController {
    private final PurchaseRepository purchaseRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PurchaseController(PurchaseRepository purchaseRepository, PropertyRepository propertyRepository,
            UserRepository userRepository) {
        this.purchaseRepository = purchaseRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Purchase> getAll() {
        return purchaseRepository.findAll();
    }

    // Check if a user already bought a property
    @GetMapping("/check")
    public ResponseEntity<?> checkPurchase(@RequestParam Long userId, @RequestParam Long propertyId) {
        boolean alreadyBought = purchaseRepository.existsByUserIdAndPropertyId(userId, propertyId);
        return ResponseEntity.ok(Map.of("alreadyBought", alreadyBought));
    }

    @GetMapping("/user/{userId}")
    public List<Purchase> getByUser(@PathVariable Long userId) {
        return purchaseRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<?> createPurchase(@RequestBody Map<String, Object> data) {
        Long propertyId = Long.parseLong(data.get("propertyId").toString());
        Long userId = Long.parseLong(data.get("userId").toString());

        // Prevent double purchase
        if (purchaseRepository.existsByUserIdAndPropertyId(userId, propertyId)) {
            return ResponseEntity.status(409).body(Map.of("error", "Vous avez déjà acquis ce bien."));
        }

        Property property = propertyRepository.findById(propertyId).orElseThrow();

        // Check if property is already SOLD
        if ("SOLD".equals(property.getStatus())) {
            // Check if the same user owns it already (edge case)
            if (purchaseRepository.existsByUserIdAndPropertyId(userId, propertyId)) {
                return ResponseEntity.status(409).body(Map.of("error", "Ce bien vous appartient déjà."));
            }
            return ResponseEntity.status(409).body(Map.of("error", "Ce bien n'est plus disponible."));
        }

        Purchase purchase = new Purchase();
        purchase.setProperty(property);
        purchase.setUser(userRepository.findById(userId).orElseThrow());
        purchase.setPurchaseDate(LocalDateTime.now());
        purchase.setAmount(property.getPrice());
        String ref = "KSM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        purchase.setTransactionReference(ref);

        // Mark property as SOLD
        property.setStatus("SOLD");
        propertyRepository.save(property);

        return ResponseEntity.ok(purchaseRepository.save(purchase));
    }
}
