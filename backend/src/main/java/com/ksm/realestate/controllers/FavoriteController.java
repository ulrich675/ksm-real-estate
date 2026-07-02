package com.ksm.realestate.controllers;

import com.ksm.realestate.models.Favorite;
import com.ksm.realestate.models.User;
import com.ksm.realestate.models.Property;
import com.ksm.realestate.repositories.FavoriteRepository;
import com.ksm.realestate.repositories.UserRepository;
import com.ksm.realestate.repositories.PropertyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public FavoriteController(FavoriteRepository favoriteRepository, UserRepository userRepository,
            PropertyRepository propertyRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
    }

    @GetMapping("/{userId}")
    public List<Property> getFavorites(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return favoriteRepository.findByUser(user).stream()
                .map(Favorite::getProperty)
                .collect(Collectors.toList());
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleFavorite(@RequestBody Map<String, Long> data) {
        Long userId = data.get("userId");
        Long propertyId = data.get("propertyId");

        User user = userRepository.findById(userId).orElseThrow();
        Property property = propertyRepository.findById(propertyId).orElseThrow();

        String status = favoriteRepository.findByUserAndProperty(user, property)
                .map(f -> {
                    favoriteRepository.delete(f);
                    return "removed";
                })
                .orElseGet(() -> {
                    Favorite f = new Favorite();
                    f.setUser(user);
                    f.setProperty(property);
                    favoriteRepository.save(f);
                    return "added";
                });

        // Recalculate hearts from live favorite count
        long favCount = favoriteRepository.countByProperty(property);
        property.setHearts((int) favCount);
        propertyRepository.save(property);

        return ResponseEntity.ok(Map.of("status", status, "hearts", favCount));
    }

    @GetMapping("/counts")
    public Map<Long, Long> getFavoriteCounts() {
        return favoriteRepository.countFavoritesPerProperty().stream()
                .collect(Collectors.toMap(
                        obj -> (Long) obj[0],
                        obj -> (Long) obj[1]));
    }
}
