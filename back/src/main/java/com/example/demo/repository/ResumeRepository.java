package com.example.demo.repository;

import com.example.demo.model.Resume;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUser(User user);
    List<Resume> findByUserId(Long userId);
    List<Resume> findByIsPublicTrue();
    Optional<Resume> findByPublicUrl(String url);
    Optional<Resume> findByPublicUrlAndIsPublicTrue(String url);
}
