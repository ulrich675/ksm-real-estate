package com.ksm.realestate.controllers;

import com.ksm.realestate.models.Comparison;
import com.ksm.realestate.models.User;
import com.ksm.realestate.models.Property;
import com.ksm.realestate.repositories.ComparisonRepository;
import com.ksm.realestate.repositories.UserRepository;
import com.ksm.realestate.repositories.PropertyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comparisons")
@CrossOrigin(origins = "*")
public class ComparisonController {
    private final ComparisonRepository comparisonRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public ComparisonController(ComparisonRepository comparisonRepository, UserRepository userRepository,
            PropertyRepository propertyRepository) {
        this.comparisonRepository = comparisonRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }

    @GetMapping("/{userId}")
    public List<Property> getComparisons(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return comparisonRepository.findByUser(user).stream()
                .map(Comparison::getProperty)
                .collect(Collectors.toList());
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleComparison(@RequestBody Map<String, Long> data) {
        Long userId = data.get("userId");
        Long propertyId = data.get("propertyId");

        User user = userRepository.findById(userId).orElseThrow();
        Property property = propertyRepository.findById(propertyId).orElseThrow();

        return comparisonRepository.findByUserAndProperty(user, property)
                .map(c -> {
                    comparisonRepository.delete(c);
                    return ResponseEntity.ok(Map.of("status", "removed"));
                })
                .orElseGet(() -> {
                    // Check limit of 3
                    if (comparisonRepository.findByUser(user).size() >= 3) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Maximum 3 biens à comparer"));
                    }
                    Comparison c = new Comparison();
                    c.setUser(user);
                    c.setProperty(property);
                    comparisonRepository.save(c);
                    return ResponseEntity.ok(Map.of("status", "added"));
                });
    }
}
