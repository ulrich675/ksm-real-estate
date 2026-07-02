package com.ksm.realestate.controllers;

import com.ksm.realestate.models.Property;
import com.ksm.realestate.models.User;
import com.ksm.realestate.models.VirtualTourPayment;
import com.ksm.realestate.repositories.PropertyRepository;
import com.ksm.realestate.repositories.UserRepository;
import com.ksm.realestate.repositories.VirtualTourPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/virtual-tours") // Plural match for frontend
@CrossOrigin(origins = "*")
public class VirtualTourController {

    @Autowired
    private VirtualTourPaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @GetMapping("/price/{propertyId}")
    public ResponseEntity<?> getDynamicPrice(@PathVariable Long propertyId) {
        Optional<Property> propertyOpt = propertyRepository.findById(propertyId);
        if (propertyOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Property property = propertyOpt.get();
        int hearts = property.getHearts();

        // Base price 5000 FCFA
        // Each heart reduces price by 500 FCFA
        // Minimum price 500 FCFA
        double basePrice = 5000.0;
        double reductionPerHeart = 500.0;
        double minPrice = 500.0;

        double dynamicPrice = Math.max(minPrice, basePrice - (hearts * reductionPerHeart));

        java.util.HashMap<String, Object> response = new java.util.HashMap<>();
        response.put("propertyId", propertyId);
        response.put("hearts", hearts);
        response.put("price", dynamicPrice);
        response.put("currency", "FCFA");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/paid")
    public ResponseEntity<?> isPaid(@RequestParam Long userId, @RequestParam Long propertyId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Property> property = propertyRepository.findById(propertyId);

        java.util.HashMap<String, Object> response = new java.util.HashMap<>();
        if (user.isEmpty() || property.isEmpty()) {
            response.put("paid", false);
            return ResponseEntity.ok(response);
        }

        Optional<VirtualTourPayment> payment = paymentRepository.findByUserAndProperty(user.get(), property.get());
        response.put("paid", payment.isPresent());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pay")
    public ResponseEntity<?> recordPayment(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long propertyId = Long.valueOf(payload.get("propertyId").toString());
        Double amount = Double.valueOf(payload.get("amount").toString());

        Optional<User> user = userRepository.findById(userId);
        Optional<Property> property = propertyRepository.findById(propertyId);

        if (user.isEmpty() || property.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Property not found");
        }

        Optional<VirtualTourPayment> existing = paymentRepository.findByUserAndProperty(user.get(), property.get());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        VirtualTourPayment payment = new VirtualTourPayment();
        payment.setUser(user.get());
        payment.setProperty(property.get());
        payment.setAmount(amount);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId("VT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        return ResponseEntity.ok(paymentRepository.save(payment));
    }
}
