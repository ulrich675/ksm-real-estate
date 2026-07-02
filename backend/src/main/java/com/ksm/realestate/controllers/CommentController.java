package com.ksm.realestate.controllers;

import com.ksm.realestate.models.Comment;
import com.ksm.realestate.models.Property;
import com.ksm.realestate.models.User;
import com.ksm.realestate.repositories.CommentRepository;
import com.ksm.realestate.repositories.PropertyRepository;
import com.ksm.realestate.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    private final CommentRepository commentRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public CommentController(CommentRepository commentRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/property/{propertyId}")
    public List<Comment> getComments(@PathVariable Long propertyId) {
        return commentRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId);
    }

    @PostMapping
    public Comment createComment(@RequestBody Map<String, Object> payload) {
        Long propertyId = Long.valueOf(payload.get("propertyId").toString());
        Long userId = Long.valueOf(payload.get("userId").toString());
        String text = (String) payload.get("text");

        Property property = propertyRepository.findById(propertyId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        Comment comment = new Comment();
        comment.setProperty(property);
        comment.setUser(user);
        comment.setText(text);

        return commentRepository.save(comment);
    }
}
