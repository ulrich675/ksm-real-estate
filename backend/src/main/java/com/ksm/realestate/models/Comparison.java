package com.ksm.realestate.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "comparisons")
@Data
public class Comparison {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
}
