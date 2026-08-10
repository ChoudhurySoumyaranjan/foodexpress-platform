package com.lucky.main.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String imageUrl;

    @Column(name = "public_id")
    private String publicId;  //cloudinary image public Id

    private String foodName;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    private String description;
    private Double price;
    private Integer stock;
    private Double discount;
    private Boolean active=true;
    private Double discountedPrice;
}
