package com.eren.pact_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pacts") // Veritabanındaki tablonun adı 'pacts' olacak
public class Pact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Çoklu Dil Destekli İddia Başlıkları
    private String titleTr;
    private String titleEn;
    private String titleEs;

    private String challengerName; // İddiayı açan (örn: Eren)
    private String opponentName;   // Rakip (örn: Jacqueline)
    private String opponentInitial;

    private String status; // WAITING_ACTION, COMPLETED, BLUFF_CALLED

    private LocalDateTime createdAt;

    // Spring Boot bu objeyi ilk kez oluşturduğunda tarihi otomatik atar
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- GETTER VE SETTER METOTLARI ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitleTr() { return titleTr; }
    public void setTitleTr(String titleTr) { this.titleTr = titleTr; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }

    public String getTitleEs() { return titleEs; }
    public void setTitleEs(String titleEs) { this.titleEs = titleEs; }

    public String getChallengerName() { return challengerName; }
    public void setChallengerName(String challengerName) { this.challengerName = challengerName; }

    public String getOpponentName() { return opponentName; }
    public void setOpponentName(String opponentName) { this.opponentName = opponentName; }

    public String getOpponentInitial() { return opponentInitial; }
    public void setOpponentInitial(String opponentInitial) { this.opponentInitial = opponentInitial; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
