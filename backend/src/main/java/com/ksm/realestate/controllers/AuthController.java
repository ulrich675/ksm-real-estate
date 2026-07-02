package com.ksm.realestate.controllers;

import com.ksm.realestate.models.User;
import com.ksm.realestate.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String fullName = credentials.get("fullName");
        String password = credentials.get("password");

        return userRepository.findByUsername(fullName)
                .filter(u -> u.getPassword().equals(password))
                .map(u -> {
                    java.util.HashMap<String, Object> response = new java.util.HashMap<>();
                    if (!u.isEnabled()) {
                        response.put("success", false);
                        response.put("message", "Votre compte a été désactivé par l'administrateur.");
                        return (Map<String, Object>) response;
                    }
                    response.put("success", true);
                    response.put("user", u);
                    return (Map<String, Object>) response;
                })
                .orElseGet(() -> {
                    java.util.HashMap<String, Object> response = new java.util.HashMap<>();
                    response.put("success", false);
                    response.put("message", "Identifiants incorrects.");
                    return response;
                });
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        // Validate email domain
        if (!isValidEmail(user.getEmail())) {
            java.util.HashMap<String, Object> response = new java.util.HashMap<>();
            response.put("success", false);
            response.put("message",
                    "L'email doit utiliser l'un de ces domaines: gmail.com, outlook.com, hotmail.com, live.com, yahoo.com, yahoo.fr, protonmail.com, proton.me, icloud.com, mail.com, gmx.com, aol.com");
            return response;
        }

        // Set username to fullName as per user requirement for simplification
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            user.setUsername(user.getFullName());
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            java.util.HashMap<String, Object> response = new java.util.HashMap<>();
            response.put("success", false);
            response.put("message", "Cet utilisateur existe déjà.");
            return response;
        }
        user.setRole("VISITOR");
        User saved = userRepository.save(user);
        java.util.HashMap<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("user", saved);
        return response;
    }

    private boolean isValidEmail(String email) {
        if (email == null || !email.contains("@"))
            return false;
        String domain = email.toLowerCase().substring(email.lastIndexOf("@") + 1);
        String[] allowedDomains = { "gmail.com", "outlook.com", "hotmail.com", "live.com", "yahoo.com", "yahoo.fr",
                "protonmail.com", "proton.me", "icloud.com", "mail.com", "gmx.com", "aol.com" };
        for (String d : allowedDomains) {
            if (d.equals(domain))
                return true;
        }
        return false;
    }

    @PostMapping("/become-proprietor")
    public Map<String, Object> becomeProprietor(@RequestBody Map<String, Object> data) {
        Long userId = Long.parseLong(data.get("userId").toString());
        User u = userRepository.findById(userId).orElse(null);
        if (u != null) {
            u.setProprietorStatus("PENDING");
            if (data.get("email") != null)
                u.setEmail((String) data.get("email"));
            if (data.get("phone") != null)
                u.setPhone((String) data.get("phone"));
            if (data.get("city") != null)
                u.setCity((String) data.get("city"));
            if (data.get("neighborhood") != null)
                u.setNeighborhood((String) data.get("neighborhood"));
            userRepository.save(u);
            java.util.HashMap<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "Request submitted");
            return response;
        }
        java.util.HashMap<String, Object> response = new java.util.HashMap<>();
        response.put("success", false);
        response.put("message", "User not found");
        return response;
    }
}
