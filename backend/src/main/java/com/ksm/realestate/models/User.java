package com.ksm.realestate.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String role; // ADMIN, PROPRIETOR, VISITOR
    private String fullName;
    private String email;
    private String phone;
    private String neighborhood;
    private String city;
    private String proprietorStatus; // PENDING, APPROVED, REJECTED (for "become proprietor" requests)
    private boolean enabled = true;
}
