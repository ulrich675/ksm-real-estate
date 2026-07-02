package com.ksm.realestate.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "visit_requests")
@Data
public class VisitRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Property property;

    @ManyToOne
    private User visitor;

    private String visitDate;
    private String status; // PENDING, APPROVED, REJECTED
    private String message;
}
