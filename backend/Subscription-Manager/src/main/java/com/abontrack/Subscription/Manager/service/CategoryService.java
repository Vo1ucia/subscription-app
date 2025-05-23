package com.abontrack.Subscription.Manager.service;

import com.abontrack.Subscription.Manager.model.Category;
import com.abontrack.Subscription.Manager.repository.CategoryRepository;
import com.abontrack.Subscription.Manager.exception.ResourceNotFoundException;
import com.abontrack.Subscription.Manager.exception.DuplicateResourceException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByNameAsc();
    }

    @Transactional(readOnly = true)
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with name: " + name));
    }

    @Transactional
    public Category createCategory(Category category) {
        // Vérifier si une catégorie avec le même nom existe déjà
        Optional<Category> existingCategory = categoryRepository.findByName(category.getName());
        if (existingCategory.isPresent()) {
            throw new DuplicateResourceException("Category with name '" + category.getName() + "' already exists");
        }
        
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);
        
        // Vérifier si une catégorie différente avec le même nom existe déjà
        if (!category.getName().equals(categoryDetails.getName())) {
            Optional<Category> existingCategory = categoryRepository.findByName(categoryDetails.getName());
            if (existingCategory.isPresent()) {
                throw new DuplicateResourceException("Category with name '" + categoryDetails.getName() + "' already exists");
            }
        }
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        
        // Vérifier si la catégorie est utilisée par des abonnements
        if (!category.getSubscriptions().isEmpty()) {
            throw new IllegalStateException("Cannot delete category with active subscriptions");
        }
        
        categoryRepository.delete(category);
    }
    
    @Transactional
    public void initDefaultCategories() {
        // Liste des catégories par défaut à créer si elles n'existent pas
        String[][] defaultCategories = {
            {"Streaming", "Services de streaming vidéo et audio"},
            {"Cloud", "Services de stockage cloud et sauvegarde"},
            {"Software", "Abonnements à des logiciels"},
            {"Gaming", "Abonnements à des services de jeux"},
            {"News", "Abonnements à des journaux et magazines"},
            {"Fitness", "Abonnements à des clubs de fitness ou applications"},
            {"Téléphonie", "Forfaits téléphoniques et internet"},
            {"Assurance", "Assurances diverses"},
            {"Autre", "Autres types d'abonnements"}
        };
        
        for (String[] categoryData : defaultCategories) {
            String name = categoryData[0];
            String description = categoryData[1];
            
            if (!categoryRepository.findByName(name).isPresent()) {
                Category category = new Category(name, description);
                categoryRepository.save(category);
            }
        }
    }
}