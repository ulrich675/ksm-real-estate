package com.ksm.realestate.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "properties")
@Data
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String location;
    private String neighborhood;
    private String city;
    private String category; // VILLA, APARTMENT, LOFT, LAND, BUREAU
    private String status; // AVAILABLE, SOLD
    private String mainImageUrl;
    private String proprietorName;
    private String proprietorPhone;

    @ElementCollection
    private java.util.List<String> characteristicImages;

    // Number of hearts (1..5). Used to determine virtual tour price.
    private Integer hearts = 0;

    // JSON structure describing virtual tour nodes (rooms) and their 360
    // images/hotspots.
    @Lob
    private String virtualTourNodesJson;

    @ManyToOne
    @JoinColumn(name = "proprietor_id")
    private User proprietor;

    private boolean active = true;
}
