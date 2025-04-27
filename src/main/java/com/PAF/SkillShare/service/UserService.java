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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

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

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
