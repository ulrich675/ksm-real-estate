package com.ksm.realestate.repositories;

import com.ksm.realestate.models.Favorite;
import com.ksm.realestate.models.User;
import com.ksm.realestate.models.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);

    Optional<Favorite> findByUserAndProperty(User user, Property property);

    @Query("SELECT f.property.id, COUNT(f) FROM Favorite f GROUP BY f.property.id")
    List<Object[]> countFavoritesPerProperty();

    long countByProperty(Property property);
}
