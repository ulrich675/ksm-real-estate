package com.ksm.realestate.controllers;

import com.ksm.realestate.models.Property;
import com.ksm.realestate.repositories.PropertyRepository;
import com.ksm.realestate.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyController(PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Property> getAll() {
        return propertyRepository.findAll();
    }

    @GetMapping("/{id}")
    public Property getById(@PathVariable Long id) {
        return propertyRepository.findById(id).orElse(null);
    }

    @GetMapping("/proprietor/{proprietorId}")
    public List<Property> getByProprietor(@PathVariable Long proprietorId) {
        return propertyRepository.findByProprietorId(proprietorId);
    }

    @SuppressWarnings("unchecked")
    @PostMapping
    public Property createProperty(@RequestBody Map<String, Object> data) {
        Property property = new Property();
        property.setTitle((String) data.get("title"));

        Object price = data.get("price");
        if (price != null && !price.toString().isEmpty()) {
            try {
                property.setPrice(Double.parseDouble(price.toString()));
            } catch (NumberFormatException e) {
                property.setPrice(0.0);
            }
        }

        property.setLocation((String) data.get("location"));
        property.setNeighborhood((String) data.get("neighborhood"));
        property.setCity((String) data.get("city"));
        property.setCategory((String) data.get("category"));
        property.setDescription((String) data.get("description"));
        property.setProprietorName((String) data.get("proprietorName"));
        property.setProprietorPhone((String) data.get("proprietorPhone"));
        property.setMainImageUrl((String) data.get("mainImageUrl"));

        if (data.get("characteristicImages") instanceof List) {
            property.setCharacteristicImages((List<String>) data.get("characteristicImages"));
        }

        property.setVirtualTourNodesJson((String) data.get("virtualTourNodesJson"));
        property.setStatus("AVAILABLE");

        if (data.get("proprietorId") != null && !data.get("proprietorId").toString().isEmpty()) {
            try {
                Long proprietorId = Long.parseLong(data.get("proprietorId").toString());
                userRepository.findById(proprietorId).ifPresent(property::setProprietor);
            } catch (NumberFormatException e) {
            }
        }

        return propertyRepository.save(property);
    }

    @SuppressWarnings("unchecked")
    @PutMapping("/{id}")
    public Property update(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        Property existing = propertyRepository.findById(id).orElseThrow();
        if (data.get("title") != null)
            existing.setTitle((String) data.get("title"));
        if (data.get("description") != null)
            existing.setDescription((String) data.get("description"));
        if (data.get("price") != null && !data.get("price").toString().isEmpty()) {
            try {
                existing.setPrice(Double.parseDouble(data.get("price").toString()));
            } catch (NumberFormatException e) {
            }
        }
        if (data.get("location") != null)
            existing.setLocation((String) data.get("location"));
        if (data.get("neighborhood") != null)
            existing.setNeighborhood((String) data.get("neighborhood"));
        if (data.get("city") != null)
            existing.setCity((String) data.get("city"));
        if (data.get("category") != null)
            existing.setCategory((String) data.get("category"));
        if (data.get("status") != null)
            existing.setStatus((String) data.get("status"));
        if (data.get("mainImageUrl") != null)
            existing.setMainImageUrl((String) data.get("mainImageUrl"));
        if (data.get("proprietorName") != null)
            existing.setProprietorName((String) data.get("proprietorName"));
        if (data.get("proprietorPhone") != null)
            existing.setProprietorPhone((String) data.get("proprietorPhone"));

        if (data.get("characteristicImages") instanceof List) {
            existing.setCharacteristicImages((List<String>) data.get("characteristicImages"));
        }
        if (data.get("virtualTourNodesJson") != null) {
            existing.setVirtualTourNodesJson((String) data.get("virtualTourNodesJson"));
        }

        return propertyRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        propertyRepository.deleteById(id);
    }

    @PutMapping("/{id}/toggle-status")
    public Property toggleStatus(@PathVariable Long id) {
        Property property = propertyRepository.findById(id).orElseThrow();
        property.setActive(!property.isActive());
        return propertyRepository.save(property);
    }
}
