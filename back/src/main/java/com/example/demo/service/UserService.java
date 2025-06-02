package com.example.demo.service;

import com.example.demo.dto.UserDto;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDto);
    }

    public Optional<UserDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToDto);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
      public Optional<UserDto> updateUser(Long id, UserDto userDto) {
        return userRepository.findById(id).map(user -> {
            // Update email if provided and changed
            if (userDto.getEmail() != null && !userDto.getEmail().isEmpty() 
                && !userDto.getEmail().equals(user.getEmail())) {
                
                // Check if email already exists
                if (userRepository.existsByEmail(userDto.getEmail()) && 
                    !user.getEmail().equals(userDto.getEmail())) {
                    throw new RuntimeException("Email already in use");
                }
                user.setEmail(userDto.getEmail());
            }
            
            // Update username if provided (optional)
            if (userDto.getUsername() != null && !userDto.getUsername().isEmpty() 
                && !userDto.getUsername().equals(user.getUsername())) {
                
                // Check if username already exists
                if (userRepository.existsByUsername(userDto.getUsername()) && 
                    !user.getUsername().equals(userDto.getUsername())) {
                    throw new RuntimeException("Username already in use");
                }
                user.setUsername(userDto.getUsername());
            }
            
            // Update timestamp
            user.setUpdatedAt(java.time.LocalDateTime.now());
            
            return convertToDto(userRepository.save(user));
        });
    }
    
    public boolean changePassword(Long id, String currentPassword, String newPassword) {
        return userRepository.findById(id).map(user -> {
            // Verify current password
            if (passwordEncoder.matches(currentPassword, user.getPassword())) {
                // Update to new password
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            }
            return false;
        }).orElse(false);
    }    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public Optional<UserDto> updateProfilePhoto(Long id, String photoUrl) {
        return userRepository.findById(id).map(user -> {
            user.setProfilePhoto(photoUrl);
            user.setUpdatedAt(java.time.LocalDateTime.now());
            User savedUser = userRepository.save(user);
            return convertToDto(savedUser);
        });
    }    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setProfilePhoto(user.getProfilePhoto());
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet()));
        return dto;
    }
}
