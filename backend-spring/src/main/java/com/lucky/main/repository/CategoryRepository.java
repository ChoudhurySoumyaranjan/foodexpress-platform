package com.lucky.main.repository;

import com.lucky.main.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {

    Optional<Category> findByNameAndActiveTrue(String name);
//    Optional<Category> findById(Long id);
    List<Category> findAllByActiveTrue();
    Optional<Category> findByIdAndActiveTrue(Long id);
    Page<Category> findByActiveTrue(Pageable pageable);
    long countByActiveTrue();
}
