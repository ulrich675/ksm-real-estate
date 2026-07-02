package com.ksm.realestate.controllers;

import com.ksm.realestate.models.User;
import com.ksm.realestate.repositories.UserRepository;
import com.ksm.realestate.repositories.VisitRequestRepository;
import com.ksm.realestate.repositories.PurchaseRepository;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserRepository userRepository;
    private final VisitRequestRepository visitRequestRepository;
    private final PurchaseRepository purchaseRepository;

    public UserController(UserRepository userRepository, VisitRequestRepository visitRequestRepository,
            PurchaseRepository purchaseRepository) {
        this.userRepository = userRepository;
        this.visitRequestRepository = visitRequestRepository;
        this.purchaseRepository = purchaseRepository;
    }

    @GetMapping
    public List<User> getAll(@RequestParam(required = false) String status) {
        if ("PENDING".equals(status)) {
            return userRepository.findAll().stream()
                    .filter(u -> "PENDING".equals(u.getProprietorStatus()))
                    .collect(Collectors.toList());
        }
        return userRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @PostMapping("/{id}/approve")
    public User approve(@PathVariable Long id) {
        User u = userRepository.findById(id).orElseThrow();
        u.setRole("PROPRIETOR");
        u.setProprietorStatus("APPROVED");
        return userRepository.save(u);
    }

    @PostMapping("/{id}/reject")
    public User reject(@PathVariable Long id) {
        User u = userRepository.findById(id).orElseThrow();
        u.setProprietorStatus("REJECTED");
        return userRepository.save(u);
    }

    @PutMapping("/{id}/toggle-status")
    public User toggleStatus(@PathVariable Long id) {
        User u = userRepository.findById(id).orElseThrow();
        u.setEnabled(!u.isEnabled());
        return userRepository.save(u);
    }

    @GetMapping("/{id}/history")
    public List<Map<String, Object>> getHistory(@PathVariable Long id) {
        List<Map<String, Object>> history = new ArrayList<>();

        visitRequestRepository.findAll().stream()
                .filter(v -> v.getVisitor().getId().equals(id))
                .forEach(v -> {
                    java.util.HashMap<String, Object> item = new java.util.HashMap<>();
                    item.put("type", "visit");
                    item.put("id", v.getId());
                    item.put("propertyId", v.getProperty().getId());
                    item.put("propertyTitle", v.getProperty().getTitle());
                    item.put("propertyLocation", v.getProperty().getLocation());
                    item.put("ownerName", v.getProperty().getProprietorName());
                    item.put("ownerPhone", v.getProperty().getProprietorPhone());
                    item.put("visitDate", v.getVisitDate());
                    item.put("status", v.getStatus());
                    item.put("date", v.getVisitDate()); // Using visitDate as sort date for simplicity
                    history.add(item);
                });

        purchaseRepository.findAll().stream()
                .filter(p -> p.getUser().getId().equals(id))
                .forEach(p -> {
                    java.util.HashMap<String, Object> item = new java.util.HashMap<>();
                    item.put("type", "purchase");
                    item.put("id", p.getId());
                    item.put("propertyId", p.getProperty().getId());
                    item.put("propertyTitle", p.getProperty().getTitle());
                    item.put("propertyLocation", p.getProperty().getLocation());
                    item.put("ownerName", p.getProperty().getProprietorName());
                    item.put("ownerPhone", p.getProperty().getProprietorPhone());
                    item.put("amount", p.getAmount());
                    item.put("date", p.getPurchaseDate().toString());
                    item.put("ref", p.getTransactionReference());
                    history.add(item);
                });

        return history.stream()
                .sorted((a, b) -> {
                    String dateA = a.get("date") != null ? a.get("date").toString() : "";
                    String dateB = b.get("date") != null ? b.get("date").toString() : "";
                    return dateB.compareTo(dateA);
                })
                .collect(Collectors.toList());
    }
}
