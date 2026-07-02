package com.ksm.realestate.controllers;

import com.ksm.realestate.models.VisitRequest;
import com.ksm.realestate.models.Property;
import com.ksm.realestate.models.User;
import com.ksm.realestate.repositories.VisitRequestRepository;
import com.ksm.realestate.repositories.PropertyRepository;
import com.ksm.realestate.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin(origins = "*")
public class VisitRequestController {
    private final VisitRequestRepository visitRequestRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public VisitRequestController(VisitRequestRepository visitRequestRepository, PropertyRepository propertyRepository,
            UserRepository userRepository) {
        this.visitRequestRepository = visitRequestRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<VisitRequest> getAll() {
        return visitRequestRepository.findAll();
    }

    @PostMapping
    public VisitRequest createVisit(@RequestBody Map<String, Object> data) {
        VisitRequest v = new VisitRequest();

        try {
            Long propertyId = Long.parseLong(data.get("propertyId").toString());
            Long visitorId = Long.parseLong(data.get("visitorId").toString());

            v.setProperty(propertyRepository.findById(propertyId).orElseThrow());
            v.setVisitor(userRepository.findById(visitorId).orElseThrow());
        } catch (Exception e) {
            throw new RuntimeException("ID de propriété ou de visiteur invalide");
        }

        v.setVisitDate((String) data.get("visitDate"));
        v.setMessage((String) data.get("message"));
        v.setStatus("PENDING");

        return visitRequestRepository.save(v);
    }

    @PatchMapping("/{id}")
    public VisitRequest updateStatus(@PathVariable Long id, @RequestBody Map<String, String> data) {
        VisitRequest v = visitRequestRepository.findById(id).orElseThrow();
        v.setStatus(data.get("status"));
        return visitRequestRepository.save(v);
    }
}
