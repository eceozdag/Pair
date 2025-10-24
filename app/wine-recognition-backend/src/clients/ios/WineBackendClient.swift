import Foundation

class WineBackendClient {
    private let baseURL: String
    private let session: URLSession

    init(baseURL: String) {
        self.baseURL = baseURL
        self.session = URLSession.shared
    }

    func fetchWines(completion: @escaping ([Wine]?, Error?) -> Void) {
        let url = URL(string: "\(baseURL)/api/wines")!
        let task = session.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                completion(nil, error)
                return
            }
            do {
                let wines = try JSONDecoder().decode([Wine].self, from: data)
                completion(wines, nil)
            } catch {
                completion(nil, error)
            }
        }
        task.resume()
    }

    func fetchPairings(forWineId wineId: String, completion: @escaping ([Pairing]?, Error?) -> Void) {
        let url = URL(string: "\(baseURL)/api/pairings/\(wineId)")!
        let task = session.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                completion(nil, error)
                return
            }
            do {
                let pairings = try JSONDecoder().decode([Pairing].self, from: data)
                completion(pairings, nil)
            } catch {
                completion(nil, error)
            }
        }
        task.resume()
    }

    func submitFeedback(forWineId wineId: String, feedback: Feedback, completion: @escaping (Error?) -> Void) {
        let url = URL(string: "\(baseURL)/api/feedback/\(wineId)")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let jsonData = try JSONEncoder().encode(feedback)
            request.httpBody = jsonData
        } catch {
            completion(error)
            return
        }
        
        let task = session.dataTask(with: request) { _, response, error in
            completion(error)
        }
        task.resume()
    }
}

struct Wine: Codable {
    let id: String
    let name: String
    let type: String
}

struct Pairing: Codable {
    let id: String
    let wineId: String
    let food: String
}

struct Feedback: Codable {
    let rating: Int
    let comments: String
}