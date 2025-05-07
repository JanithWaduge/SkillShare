package com.PAF.SkillShare.service;

import com.PAF.SkillShare.model.User;
import com.PAF.SkillShare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Method to retrieve all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Method to retrieve a user by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // Method to create a new user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Method to update an existing user
    public User updateUser(String id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setPassword(updatedUser.getPassword());
            user.setBio(updatedUser.getBio());
            user.setSkills(updatedUser.getSkills());
            user.setProfileImageUrl(updatedUser.getProfileImageUrl());
            user.setCreatedAt(updatedUser.getCreatedAt());
            return userRepository.save(user);
        }).orElse(null);
    }

    // Method to delete a user
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // Method to authenticate a user by checking if email and password match
    public Optional<User> authenticateUser(String email, String password) {
        return userRepository.findAll().stream()
                .filter(user -> user.getEmail().equals(email) && user.getPassword().equals(password))
                .findFirst();
    }
}
