package com.abontrack.Subscription.Manager.repository;

import com.abontrack.Subscription.Manager.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findAllByOrderByNameAsc();
    
    Optional<Category> findByName(String name);
}