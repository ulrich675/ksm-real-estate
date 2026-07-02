package com.ksm.realestate.repositories;

import com.ksm.realestate.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
}
