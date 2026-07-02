package com.ksm.realestate;

import com.ksm.realestate.models.Property;
import com.ksm.realestate.models.User;
import com.ksm.realestate.repositories.PropertyRepository;
import com.ksm.realestate.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
        private final UserRepository userRepository;
        private final PropertyRepository propertyRepository;

        public DataInitializer(UserRepository userRepository, PropertyRepository propertyRepository) {
                this.userRepository = userRepository;
                this.propertyRepository = propertyRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                // Initialize missing critical users
                registerUser("KSM Admin", "KSM Admin", "ksm2026_admin", "ADMIN", "admin@ksm-realestate.cm",
                                "+237 656 309 892", "Yaoundé", "Centre Administratif", null);

                // OWNERS
                registerUser("Samuel Eto'o", "Samuel Eto'o", "etoopass_2026", "PROPRIETOR", "samuel@ksm-realestate.cm",
                                "+237 699 001 001", "Yaoundé", "Bastos", "APPROVED");
                registerUser("Rigobert Song", "Rigobert Song", "songpass_2026", "PROPRIETOR",
                                "rigobert@ksm-realestate.cm", "+237 677 002 002", "Douala", "Bonapriso", "APPROVED");
                registerUser("Alice Bella", "Alice Bella", "alicepass_2026", "PROPRIETOR", "alice@ksm-realestate.cm",
                                "+237 655 003 003", "Kribi", "Plage", "APPROVED");
                registerUser("Roger Milla", "Roger Milla", "millapass_2026", "PROPRIETOR", "roger@ksm-realestate.cm",
                                "+237 677 004 004", "Yaoundé", "Messa", "APPROVED");
                registerUser("Francine Mbango", "Francine Mbango", "mbangopass_2026", "PROPRIETOR",
                                "francine@ksm-realestate.cm", "+237 699 005 005", "Douala", "Akwa", "APPROVED");

                // VISITORS
                registerUser("petit", "Petit", "pass_2026", "VISITOR", null, null, "Yaoundé", null, null);
                registerUser("Marc Ondoua", "Marc Ondoua", "marcpass_2026", "VISITOR", "marc.ondoua@gmail.cm",
                                "+237 677 100 200", "Yaoundé", "Mvan", null);

                if (propertyRepository.count() == 0) {
                        User owner1 = userRepository.findByUsername("Samuel Eto'o").orElse(null);
                        User owner2 = userRepository.findByUsername("Rigobert Song").orElse(null);
                        User owner3 = userRepository.findByUsername("Alice Bella").orElse(null);

                        if (owner1 != null && owner2 != null && owner3 != null) {
                                String[] mainImages = {
                                                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1549143516-4dc60f244a71?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600572236304-483a936a51d0?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600566753086-00f18fb6f3ea?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600047509789-1f621bb77c33?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600585154166-d8897c8f930d?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600319108133-f25c603510a7?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1545324418-f1d3c5953e06?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1502472545311-6228469acf90?q=80&w=1200",
                                                "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200"
                                };

                                String[][] roomImages = {
                                                { "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=800",
                                                                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800",
                                                                "https://images.unsplash.com/photo-1600566753086-00f18fb6f3ea?q=80&w=800" },
                                                { "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800",
                                                                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
                                                                "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=800" }
                                };

                                for (int i = 0; i < mainImages.length; i++) {
                                        User owner = (i % 3 == 0) ? owner1 : (i % 3 == 1) ? owner2 : owner3;
                                        String cat = (i % 4 == 0) ? "VILLA"
                                                        : (i % 4 == 1) ? "APARTMENT" : (i % 4 == 2) ? "LOFT" : "LAND";
                                        saveProperty("Propriété Prestige #" + (i + 1), 500000.0 + (i * 150000.0),
                                                        "Quartier " + (i + 1), "Nord", "Yaoundé", cat, owner,
                                                        mainImages[i],
                                                        java.util.Arrays.asList(roomImages[i % 2]));
                                }
                        }
                }
        }

        private void registerUser(String username, String fullName, String password, String role, String email,
                        String phone, String city, String neighborhood, String status) {
                if (userRepository.findByUsername(username).isEmpty()) {
                        User u = new User();
                        u.setUsername(username);
                        u.setFullName(fullName);
                        u.setPassword(password);
                        u.setRole(role);
                        u.setEmail(email);
                        u.setPhone(phone);
                        u.setCity(city);
                        u.setNeighborhood(neighborhood);
                        u.setProprietorStatus(status);
                        userRepository.save(u);
                }
        }

        private void saveProperty(String title, Double price, String location, String neighborhood, String city,
                        String category, User owner, String imageUrl, java.util.List<String> characteristicImages) {
                Property p = new Property();
                p.setTitle(title);
                p.setDescription("Un bien d'exception situé à " + location
                                + ". Offrant tout le confort moderne et une sécurité optimale.");
                p.setPrice(price);
                p.setLocation(location);
                p.setNeighborhood(neighborhood);
                p.setCity(city);
                p.setCategory(category);
                p.setMainImageUrl(imageUrl);
                p.setCharacteristicImages(characteristicImages);
                p.setProprietor(owner);
                p.setProprietorName(owner.getFullName());
                p.setProprietorPhone(owner.getPhone());
                p.setStatus("AVAILABLE");
                p.setActive(true);
                p.setHearts((int) (Math.random() * 20));

                String tourJson = "{\"nodes\": [{\"id\": \"e\", \"label\": \"Entrée\", \"image\": \"" + imageUrl
                                + "\"}]}";
                p.setVirtualTourNodesJson(tourJson);

                propertyRepository.save(p);
        }
}
